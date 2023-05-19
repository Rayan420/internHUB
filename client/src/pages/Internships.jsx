import { useEffect, useState } from "react";
import SideNavbar from "../components/NavBar";
import Header from "../components/Header";
import InternshipPage from "../components/internship/InternshipPage";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNum: "",
    role: "",
  });
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    studentNumber: "",
    department: {
      id: "",
      name: "",
    },
  });
  const [coordinatorInfo, setCoordinatorInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { email } = auth() || {};
        // Simulate loading by adding a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get("/student/" + email, {
          headers: {
            authorization: authHeader(),
          },
        });

        const { user, student, coordinator } = response.data;
        setUserInfo(user);
        setStudentInfo(student);
        setCoordinatorInfo(coordinator); // Set the coordinator information

        const department = student.department?.name || ""; // Access department name safely
        setIsLoading(false);

        // Make an Axios GET request to fetch internships based on user's department
        console.log("department:", department )
        axios
          .get("/internships/" + department, {
            headers: {
              authorization: authHeader(),
            },
          })
          .then((response) => {
            setInternships(response.data);
          })
          .catch((error) => {
            console.error("Error fetching internships:", error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    document.title = "InternHUB - Opportunities";
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <h3>Getting internships<span className="ellipsis"></span></h3>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Internships", to: "/internships", icon: "bxs-user" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={"Ahmed Rayan"}
        role={"Student"}
        id={"200209393"}
      />

      <div className="main-content main-dashboard">
        <Header title="Internships" />

        <InternshipPage internships={internships} />
      </div>
    </div>
  );
};

export default Internships;
