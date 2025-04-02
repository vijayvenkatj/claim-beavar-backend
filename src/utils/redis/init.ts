import { createClient } from "redis";

export const redisClient = createClient({
    socket: {
      host: "localhost",
      port: 6379,
    }
})

export const connectRedis = async () => {  
    redisClient.on("error", (err) => {
        console.error("Redis Client Error", err);
    });
    
    try {
        await redisClient.connect()
        console.log("Connected to Redis");
    }
    catch (error) {
        console.error("Error connecting to Redis", error);
    }

    return redisClient;
}
