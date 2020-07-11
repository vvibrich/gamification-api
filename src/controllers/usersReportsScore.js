import UsersReportsScoreModel from '../models/usersReportsScore'
import ReportsRewards from '../services/reportsRewards'
import { updateUsersLeaderboards } from '../controllers/leaderboards'
import ReportsModel from '../models/reports'

export function postReportScore(request, response) {
    try {
        let UsersReportsScore = {
            users_id: request.params.usersId,
            reports_id: request.params.reportsId
        };
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

        if (requestBody.approved === false) {
            const reportsModel = new ReportsModel({ approved: false });
            reportsModel.findOneAndUpdate(UsersReportsScore.users_id, (data) => {
                if (data.affectedRows !== 1) {
                    throw new ErrorEvent("Could not update reports table");
                }
            });

            return response.status(200).json({
                message: "users report has been update to not approved"
            });
        } else {
            const reportsModel = new ReportsModel({ approved: true });
            reportsModel.findOneAndUpdate(UsersReportsScore.users_id, (data) => {
                if (data.affectedRows !== 1) {
                    throw new ErrorEvent("Could not update reports table");
                }
            });
        }

        const reportsRewards = new ReportsRewards(requestBody.provider, requestBody.approved, requestBody.has_solution)
        const score = reportsRewards.getScore();
        UsersReportsScore.value = score.toString();

        const newModel = new UsersReportsScoreModel(UsersReportsScore);
        newModel.save(async (data) => {
            try {
                if (data.id) {
                    data.value = Number(data.value);

                    const leaderboardsResponse = await updateUsersLeaderboards(UsersReportsScore.users_id, data.value);
                    Promise.resolve(leaderboardsResponse).then((result) => {
                        return result;
                    });

                    return response.status(201).json(data);
                }

                return response.status(503).json(data);
            } catch (error) {
                console.log(`users/${UsersReportsScore.users_id}/score error: ${error}`)
            }

        });
    } catch (error) {
        pass
    }
}
