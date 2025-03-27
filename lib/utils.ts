    export const timeAgo = (date: Date) => {
        const now = new Date();
        const diff = Math.abs(now.getTime() - date.getTime());
        const diffInMinutes = Math.floor(diff / (1000 * 60));
        const diffInHours = Math.floor(diff / (1000 * 60 * 60));
        const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffInWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInWeeks < 52) {
            return `${diffInWeeks} weeks ago`;
        } else {
            return date.toLocaleDateString();
        }
    };