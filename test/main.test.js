import { describe, it, vi, expect } from "vitest";

const useMock = vi.fn().mockReturnThis();
const mountMock = vi.fn();
vi.mock("vue", async () => {
    const actual = await vi.importActual("vue");
    return {
        ...actual,
        createApp: vi.fn(() => ({
        use: useMock,
        mount: mountMock,
        })),
    };
    });

    vi.mock("../src/router", () => ({
    default: {},
    }));
    vi.mock("../src/App.vue", () => ({
    default: {},
    }));

    describe("main.js", () => {
    it("creates and mounts the Vue app with router", async () => {
        await import("../src/main.js");

        const { createApp } = await import("vue");
        expect(createApp).toHaveBeenCalled();
        expect(useMock).toHaveBeenCalled();
        expect(mountMock).toHaveBeenCalledWith("#app");
    });
});
