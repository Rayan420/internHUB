import SideNavbar from "../components/NavBar";



const Internships = () => {

    return (
        <div className="container">
            <SideNavbar  links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Internships", to: "/internships", icon: "bxs-user" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={"Ahmed Rayan"}
        role={"Student"}
        id={"200209393"}/>
        </div>
    );

};

export default Internships;