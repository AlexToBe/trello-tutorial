import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { RedirectToSignIn } from "@clerk/nextjs";
export default authMiddleware({
    publicRoutes: ['/','/api/webhook'],
    afterAuth(auth, req) {
        if (auth.userId && auth.isPublicRoute) { 
            let path = '/selsect-org';
            if (auth.orgId) {
                path = `/organization/${auth.orgId}`
            }
            const orgSelection = new URL(path, req.url);
            return NextResponse.redirect(orgSelection)
        }
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({returnBackUrl:req.url})
        }
        if (auth.userId && !auth.orgId && req.nextUrl.pathname !=='/select-org') {
            const orgSelection = new URL('/select-org', req.url);

            return NextResponse.redirect(orgSelection)
        }
    }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};