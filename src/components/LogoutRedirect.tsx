'use client'
import { useSession, signIn } from "next-auth/react"
import { ReactNode } from "react";
interface Props {
	children: ReactNode;
}

// When session is loading it can show the child
// Because the child has loading state and ui
// But when user is not signed he is redirected
const LogoutRedirect = ({ children }: Props): ReactNode => {
	const { status: authStatus } = useSession();
	if (authStatus === "unauthenticated") {
		signIn();
		return null;
	}
	return children

}

export default LogoutRedirect