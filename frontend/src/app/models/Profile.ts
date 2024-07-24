export class Profile {
    username: string;
    followers_count: number;
    following_count: number;
    profile_image_url: string;
    follower_ratio: number;
    timestamp: string;

    constructor(username: string, followers_count: number, following_count: number, profile_image_url: string, follower_ratio: number, timestamp: string) {
        this.username = username;
        this.followers_count = followers_count;
        this.following_count = following_count;
        this.profile_image_url = profile_image_url;
        this.follower_ratio = follower_ratio;
        this.timestamp = timestamp;
    }
}
