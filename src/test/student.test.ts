describe("GET /api/products/:id", () => {
    it("should return a product", async () => {
      const res = await request(app).get(
        "/student/read");
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Product 1");
    });
  });
  