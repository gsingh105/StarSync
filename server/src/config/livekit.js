import { AccessToken, VideoGrant } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (identity, room) => {
    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity }
    );
    const grant = new VideoGrant({ room });
    at.addGrant(grant);

    return at.toJwt();
};
