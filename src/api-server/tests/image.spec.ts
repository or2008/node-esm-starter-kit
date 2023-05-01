// import { testEndpoint } from "express-zod-api";

// test("should respond successfully", async () => {
//   const { responseMock, loggerMock } = await testEndpoint({
//     endpoint: yourEndpoint,
//     requestProps: {
//       method: "POST", // default: GET
//       body: { /* parsed JSON */ },
//     },
//     // responseProps, configProps, loggerProps
//   });
//   expect(loggerMock.error).toBeCalledTimes(0);
//   expect(responseMock.status).toBeCalledWith(200);
//   expect(responseMock.json).toBeCalledWith({
//     status: "success",
//     data: { ... },
//   });
// });
