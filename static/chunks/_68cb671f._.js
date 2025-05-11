(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/supabaseBrowserClient.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
'use client';
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://azlirnsrjayybjlmygmk.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bGlybnNyamF5eWJqbG15Z21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTk3ODQsImV4cCI6MjA2MDM5NTc4NH0.SG5dffbgvHsCbPI2-YhzPZN9KGzzMIfM3X9JljLVMeY"), {
    auth: {
        persistSession: true,
        storage: ("TURBOPACK compile-time truthy", 1) ? localStorage : ("TURBOPACK unreachable", undefined)
    }
});
const __TURBOPACK__default__export__ = supabase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/_auth-handler.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AuthHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseBrowserClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseBrowserClient.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AuthHandler() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthHandler.useEffect": ()=>{
            const handleAuth = {
                "AuthHandler.useEffect.handleAuth": async ()=>{
                    const hash = window.location.hash;
                    const params = new URLSearchParams(hash.replace('#', '?'));
                    const accessToken = params.get('access_token') // the access token from the URL hash
                    ;
                    const refreshToken = params.get('refresh_token') // the refresh token from the URL hash
                    ;
                    const type = params.get('type') // the type of authentication, e.g., 'magiclink'
                    ;
                    console.log('Access token:', accessToken);
                    console.log('Refresh token:', refreshToken);
                    console.log('Type:', type);
                    if (!accessToken || !refreshToken || type !== 'magiclink') {
                        console.warn('missing info — skipping session setup.');
                        return;
                    }
                    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseBrowserClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });
                    if (error) {
                        console.error('setSession error:', error);
                    } else {
                        console.log('Session established successfully');
                        router.replace('/');
                    }
                }
            }["AuthHandler.useEffect.handleAuth"];
            handleAuth();
        }
    }["AuthHandler.useEffect"], [
        router
    ]);
    return null;
}
_s(AuthHandler, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthHandler;
var _c;
__turbopack_context__.k.register(_c, "AuthHandler");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_68cb671f._.js.map