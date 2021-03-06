import UsersModel from '../models/users'
import { setUserActionHistory } from '../controllers/actionHistory';

const model = new UsersModel();

export function getUsers(request, response) {
    const intranetLoginQuery = request.query.intranetLogin || null;

    if (Object.keys(request.body).length !== 0) {
        return response.status(400).json({
            error: "GET request must not have a body"
        });
    }

    if (intranetLoginQuery) {
        model.findByGenericKey({ intranet_login: intranetLoginQuery }, (data) => {
            if (!data) {
                return response.status(404).json({});
            }
            return response.status(200).json(data);
        });
    }

    model.find((data) => {
        if (Array.isArray(data) === false) {
            return response.status(400).json({
                error: "can't reach database"
            });
        }

        if (data.length === 0) {
            return response.status(404).json({});
        }

        return response.status(200).json(data);
    });
}

export function getUser(request, response) {
    const id = request.params.id;

    if (id != Number(id)) {
        return response.status(400).json({
            error: "id param must be int"
        });
    }

    if (Object.keys(request.body).length !== 0) {
        return response.status(400).json({
            error: "GET request must not have a body"
        });
    }

    model.findById(id, (data) => {
        if (!data) {
            return response.status(404).json({});
        }
        return response.status(200).json(data);
    });
}

export function postUser(request, response) {
    const requestBody = request.body;

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
            error: "POST request must have a body"
        });
    }

    if (requestBody.constructor.name !== "Object") {
        return response.status(400).json({
            error: "request body is not properly formated"
        });
    }

    const newModel = new UsersModel(requestBody);
    newModel.save(async (data) => {
        try {
            if (data.id) {
                const historyDescription = `Usuário cadastrado no sistema`;

                const actionHistory = await setUserActionHistory(request, historyDescription, 'CREATE', data.id);
                Promise.resolve(actionHistory).then((result) => {
                    return result;
                });

                return response.status(201).json(data);
            }

            return response.status(503).json(data);
        } catch (error) {
            console.log(`POST /users error: ${error}`)
        }
    });
}