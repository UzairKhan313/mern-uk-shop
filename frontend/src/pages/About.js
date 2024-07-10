import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container>
      <h1 className="my-4 text-center">About Us</h1>
      <Row className="justify-content-center">
        <Col md={8}>
          {/* <Image src="path_to_your_image.jpg" rounded fluid /> */}
          <p className="mt-4">
            Welcome to UK Shop, your number one source for all things [product,
            ie: shoes, electronics, etc.]. We're dedicated to giving you the
            very best of [product], with a focus on dependability, customer
            service, and uniqueness.
          </p>
          <p>
            Founded in 2024 by Uzair Khan, UK Shop has come a long way from its
            beginnings in Peshawar. When Uzair khan first started out, his
            passion for [brand message - ie: "eco-friendly cleaning products"]
            drove them to [action: quit the day job, do tons of research, etc.]
            so that UK Shop can offer you [competitive differentiator - ie: "the
            world's most advanced toothbrush"]. We now serve customers all over
            [place - town, country, the world], and are thrilled that we're able
            to turn our passion into our own website.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to
            you. If you have any questions or comments, please don't hesitate to
            contact us.
          </p>
          <p>Sincerely,</p>
          <p>Uzair khan, Founder</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
