import { seedDatabase } from "./seed.js";

beforeEach(async () => {
    await seedDatabase();
});