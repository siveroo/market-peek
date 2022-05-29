export async function requestURL(url: string, type: "text" | "json", retryCount = 3) {
    const MAX_RETRIES = Math.max(0, retryCount) + 1;
    const RETRY_DURATION = 90000;

    let response: Response | null = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            response = await fetch(url);
            if (response.status === 429) {
                console.warn(
                    `[Request RateLimit] Too much request when accessing '${type}' from '${url}' (${i + 1}/${MAX_RETRIES - 1})`
                );
            } else {
                break;
            }
        } catch (err) {
            if (err instanceof TypeError) {
                console.error(`[${err.name}] ${err.message} (${i + 1}/${MAX_RETRIES - 1})`);
            } else {
                console.error(err);
            }
        }

        await delay(RETRY_DURATION);
    }

    if (response.ok) {
        switch (type) {
            case "json":
                return await response.json();
            case "text":
                return await response.text();
        }
    }

    return null;
}

export async function delay(time: number = 1000) {
    return new Promise((res) => {
        setTimeout(res, time);
    });
}
