import Search from "@/app/nav/Search";
import Logo from "@/app/nav/Logo";
import LoginButton from "@/app/nav/LoginButton";
import {getCurrentUser} from "@/app/actions/authActions";
import UserAction from "@/app/nav/UserAction";

export default async function Navbar()
{
	  const user = await getCurrentUser();
	  return (
			<header className={"sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md"}>
				  <Logo />
				  <Search />
				  {user ? (
						<UserAction />
				  ) : (
				  <LoginButton />
				  )}
			</header>
	  )
}