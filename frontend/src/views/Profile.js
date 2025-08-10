// import React from "react";
// import { Container, Row, Col } from "reactstrap";

// import Highlight from "../components/Highlight";
// import Loading from "../components/Loading";
// import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// export const ProfileComponent = () => {
//   const { user } = useAuth0();

//   return (
//     <Container className="mb-5">
//       <Row className="align-items-center profile-header mb-5 text-center text-md-left">
//         <Col md={2}>
//           <img
//             src={user.picture}
//             alt="Profile"
//             className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
//           />
//         </Col>
//         <Col md>
//           <h2>{user.name}</h2>
//           <p className="lead text-muted">{user.email}</p>
//         </Col>
//       </Row>
//       <Row>
//         <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
//       </Row>
//     </Container>
//   );
// };

// export default withAuthenticationRequired(ProfileComponent, {
//   onRedirecting: () => <Loading />,
// });

// import React from "react";
// import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";

// import Highlight from "../components/Highlight";
// import Loading from "../components/Loading";
// import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// import "./Profile.css"; // Add your custom styles here if needed

// export const ProfileComponent = () => {
//   const { user } = useAuth0();

//   return (
//     <Container className="my-5">
//       <Card className="shadow-lg border-0">
//         <CardBody>
//           <Row className="align-items-center">
//             <Col md={3} className="text-center mb-3 mb-md-0">
//               <img
//                 src={user.picture}
//                 alt="Profile"
//                 className="rounded-circle img-thumbnail"
//                 style={{ width: "150px", height: "150px", objectFit: "cover" }}
//               />
//             </Col>
//             <Col md={9}>
//               <CardTitle tag="h2" className="mb-1">{user.name}</CardTitle>
//               <CardText className="text-muted">{user.email}</CardText>
//               <CardText>
//                 <small className="text-muted">Welcome to your secure profile dashboard.</small>
//               </CardText>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>

//       <Card className="shadow-sm mt-4 border-0">
//         <CardBody>
//           <h5 className="mb-3">Raw User JSON</h5>
//           <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
//         </CardBody>
//       </Card>
//     </Container>
//   );
// };

// export default withAuthenticationRequired(ProfileComponent, {
//   onRedirecting: () => <Loading />,
// });

import React from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import "./Profile.css"; // Add your custom styles here if needed

export const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0">
        <CardBody>
          <Row className="align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
              <img
                src={user.picture || "src/components/profilepic.jpeg"}
                alt="Profile"
                className="rounded-circle img-thumbnail"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </Col>
            <Col md={9}>
              <CardTitle tag="h2" className="mb-1">{user.name}</CardTitle>
              <CardText className="text-muted">{user.email}</CardText>
              <CardText>
                <small className="text-muted">Welcome to your secure profile dashboard.</small>
              </CardText>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="shadow-sm mt-4 border-0">
        <CardBody>
          <h5 className="mb-3">Raw User JSON</h5>
          <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
        </CardBody>
      </Card>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
