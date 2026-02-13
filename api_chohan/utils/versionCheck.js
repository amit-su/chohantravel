const checkAppVersion = (req, res, next) => {
    // Apply version check to all requests to ensure frontend/backend synchronization
    const envVersion = process.env.APP_VERSION ? String(process.env.APP_VERSION).trim() : null;
    const requestVersion = req.headers['x-app-version'] || req.body.appVersion;

    if (envVersion) {
        // Check if version is missing or doesn't match
        // We also check for the string "undefined" which often happens with uninitialized env vars in Vite/React
        if (!requestVersion ||
            String(requestVersion).trim() === "undefined" ||
            String(requestVersion).trim() !== envVersion) {

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
