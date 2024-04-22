import { ChatRoomSidebar } from "../src/components/app/datatypes";
import renderer from 'react-test-renderer';

var exampleRoom = {
    name: "TestRoom",
    description: "This is a test room.",
}

it('ChatRoomSidebar Renders Correctly', () => {
    const tree = renderer
        .create((<ChatRoomSidebar roomObj={exampleRoom} />))
        .toJSON();
    expect(tree).toMatchSnapshot();
});