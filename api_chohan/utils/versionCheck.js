const checkAppVersion = (req, res, next) => {
    // Apply version check to all requests to ensure frontend/backend synchronization
    const envVersion = process.env.APP_VERSION ? String(process.env.APP_VERSION).trim() : null;
    const requestVersion = req.headers['x-app-version'] || req.body.appVersion;

    if (envVersion) {
        // Allow GET requests without a version header to support direct browser navigation (like file viewing)
        // while still enforcing it for mutations (POST, PUT, DELETE) and for any request that DOES provide a version.
        const isGetRequest = req.method === 'GET';
        const hasVersion = !!requestVersion && String(requestVersion).trim() !== "undefined";

        if (isGetRequest && !hasVersion) {
            return next();
        }

        // Check if version is missing or doesn't match
        if (!hasVersion || String(requestVersion).trim() !== envVersion) {
            console.warn(`[Version Mismatch] Method: ${req.method}, Path: ${req.path}, Env: ${envVersion}, Request: ${requestVersion}`);

            return res.status(403).json({
                status: 0,
                error: "Version Mismatch",
                message: `Your application version (${requestVersion || 'unknown'}) is out of date or incorrect. Required: ${envVersion}. Please refresh the page or clear your browser cache.`,
                requiredVersion: envVersion,
                currentVersion: requestVersion
            });
        }
    }

    next();
};

module.exports = checkAppVersion;
