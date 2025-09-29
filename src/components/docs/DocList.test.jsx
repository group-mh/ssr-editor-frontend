import { render, screen } from "@testing-library/react";
import { MemoryRouter  } from "react-router-dom";
import DocList from "./DocList.jsx";

jest.mock("../../models/documents", () => ({
    __esModule: true,
    default: {
        getAllDocs: jest.fn()
    },
}));

const listOfDocs = [
    { _id: "1", title: "Test I"},
    { _id: "2", title: "Test II"},
];

test("render documents in DocList", async () => {
    const docModel = (await import("../../models/documents")).default;
    docModel.getAllDocs.mockResolvedValue(listOfDocs);


render(
    <MemoryRouter>
        <DocList docs={listOfDocs} setDocs={jest.fn()} />
    </MemoryRouter>
);

const documents = await screen.findAllByText(/test/i);
expect(documents).toHaveLength(2);
expect(documents[0]).toBeInTheDocument();
expect(documents[1]).toBeInTheDocument();


const documents2 = await screen.findAllByText(/test ii/i);
expect(documents2).toHaveLength(1);
expect(documents2[0]).toBeInTheDocument();

});

test("shows notification wnen no documents in database", () => {
    render(
        <MemoryRouter>
            <DocList docs={[]} setDocs={jest.fn()} />
        </MemoryRouter>
    );

    const notification = screen.getByText(/no documents in the database/i);
    expect(notification).toBeInTheDocument();
})