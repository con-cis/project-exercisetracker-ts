import request from "supertest";
import { app } from "../build/index.js";
import chai from "chai";
import { ObjectId } from "mongodb";
const expect = chai.expect;

interface User {
  _id: string | ObjectId | undefined;
  username: string;
}

interface Exercise {
  _id: string | ObjectId | undefined;
  username: string;
  date: string | undefined;
  duration: number;
  description: string;
}

const testUser: User = { _id: undefined, username: "test_user" };
const testExercise: Exercise = {
  _id: undefined,
  username: "test_user",
  date: undefined,
  duration: 99,
  description: "test exercise",
};

describe("User Controller", function () {
  it("should generate a user when provided with a username", function (done) {
    console.log("Creating a user...");
    request(app)
      .post("/api/users")
      .type("form")
      .send({ username: "test_user" })
      .expect(201)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("User created successfully:", res.body);
        expect(res.body).to.have.property("_id");
        expect(res.body)
          .to.have.property("username")
          .to.equal(testUser.username);
        testUser._id = res.body._id;
        done();
      });
  });

  it("should get all users object with newly created test_user", function (done) {
    console.log("Getting all users...");
    request(app)
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("All users retrieved successfully:", res.body);
        expect(res.body).to.be.an("array");
        const user = res.body.find((u: User) => u._id === testUser._id);
        expect(user).to.exist;
        expect(user?.username).to.equal(testUser.username);
        done();
      });
  });
});

describe("Exercise Controller", function () {
  it("should generate an exercise when provided with a user id", function (done) {
    console.log("Creating an exercise...");
    request(app)
      .post(`/api/users/${testUser._id}/exercises`)
      .type("form")
      .send({
        _id: testUser._id,
        description: testExercise.description,
        duration: testExercise.duration,
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("Exercise created successfully:", res.body);
        expect(res.body).to.have.property("description");
        expect(res.body)
          .to.have.property("description")
          .to.equal(testExercise.description);
        expect(res.body)
          .to.have.property("duration")
          .to.equal(testExercise.duration);
        testExercise._id = res.body._id;
        done();
      });
  });

  it("should get a log of all exercises of an existing user", function (done) {
    console.log("Getting exercise logs...");
    request(app)
      .get(`/api/users/${testUser._id}/logs`)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("Exercise logs retrieved successfully:", res.body);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("log").to.be.an("array");
        const retrievedExercise = res.body.log.find(
          (log: Exercise) =>
            log.description === testExercise.description &&
            log.duration === testExercise.duration
        );
        expect(retrievedExercise).to.exist;
        done();
      });
  });
});
