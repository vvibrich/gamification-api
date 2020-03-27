import LeaderboardsModel from '../models/leaderboards'

const model = new LeaderboardsModel();

export function getUsersScore(request, response) {
    const usersId = request.params.usersId;

    if (usersId != Number(usersId)) {
        return response.status(400).json({
            error: "id param must be int"
        });
    }

    if (Object.keys(request.body).length !== 0) {
        return response.status(400).json({
            error: "GET request must not have a body"
        });
    }

    model.findByGenericKey({ users_id: usersId }, (data) => {
        if (!data) {
            return response.status(404).json({});
        }
        return response.status(200).json(data);
    });
}

export function updateUsersLeaderboards(usersId, score, callback) {
    callback(score);
    model.findByGenericKey({ users_id: usersId }, (data) => {
        console.log('retet333e');
        callback(data);
        if (!data) {
        console.log('retete')
        }
        console.log('aqui')
    });
        // if (leaderboardsObject.id) {
        //     const oldScore = leaderboardsObject.total_score;
        //     const newScore = oldScore + score;

        //     const leaderboards = {
        //         users_id: usersId,
        //         total_score: newScore
        //     };

        //     const newModel = new LeaderboardsModel(leaderboards);
        //     newModel.findOneAndUpdate(leaderboardsObject.id, (data) => {
        //         if (data.affectedRows !== 1) {
        //             throw new ErrorEvent("Could not update leaderboards table");
        //         }
        //     });
        // }

}