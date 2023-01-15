import app, { callAPI, testUser } from "@test/jestHelper";
import { stubUser } from "@test/modelStubs";

import HttpStatus from "@lib/types/httpStatus";

const route = "/v1/user";

describe(`GET ${route}`, () => {
    test("returns Bad Request for unauthorized request", async () => {
        const res = await callAPI(app, route, { auth: false });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.statusMessage).toBe("OK");
    });

    test("returns the associated user", async () => {
        const res = await callAPI(app, route);
        const { data } = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toMatchObject(testUser.data);
        expect(data.apiKey).toBeFalsy();
        expect(data.exchangeAPIKeys).toHaveLength(0);
        expect(data.processorAPIKeys).toHaveLength(0);
    });
});

describe(`PUT ${route}`, () => {
    test("returns Bad Request for unauthorized request", async () => {
        const res = await callAPI(app, route, {
            auth: false,
            options: {
                method: "PUT"
            }
        });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test("returns Bad Request for missing body", async () => {
        const res = await callAPI(app, route, {
            options: { method: "PUT" }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test.failing("returns Bad Request for invalid body", async () => {
        let res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    name: "John Doe"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Invalid field");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    email: "johndoe@"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Not a valid email");
    });

    test.todo("prevent updating api key");

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "PUT",
                body: JSON.stringify({
                    firstName: "alice",
                    lastName: "bob",
                    email: "johndoe@email.com",
                    exchangeAPIKeys: ["abcdef123"],
                    processorAPIKeys: ["uvwxyz456"]
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(res.statusMessage).toBe("No Content");
        expect(res.body).toBeFalsy();
    });

    test.todo("incorporate other User fields");

    test("updates user information based on requested changes", async () => {
        await callAPI(app, route, {
            options: {
                method: "PUT",
                body: JSON.stringify({
                    firstName: "alice",
                    lastName: "bob",
                    email: "johndoe@email.com",
                    exchangeAPIKeys: ["abcdef123"],
                    processorAPIKeys: ["uvwxyz456"]
                })
            }
        });

        const res = await callAPI(app, route);
        const { data } = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).not.toMatchObject(stubUser);

        expect(data.id).toMatch(/^[a-f\d]{24}$/i);
        expect(data.firstName).toBe("alice");
        expect(data.lastName).toBe("bob");
        expect(data.email).toBe("johndoe@email.com");
        expect(data.emailVerified).toEqual(data.createdAt);
        expect(data.emailVerified).toEqual(data.updatedAt);
        // TODO: add check for apiKey not changing
        expect(data.exchangeAPIKeys).toContain("abcdef123");
        expect(data.processorAPIKeys).toContain("uvwxyz456");
    });

    test.todo("more complex behavior, like updating lists");
    test.todo("validating api keys, etc.");
});
