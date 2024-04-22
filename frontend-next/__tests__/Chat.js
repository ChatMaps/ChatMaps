import { Chat } from "../src/components/app/datatypes";
import renderer from 'react-test-renderer';

var exampleChatObj = {
    body: "Hello, World!",
    isSystem: false,
    timestamp: 1710527946340,
    user: "TestUser"
}

var exampleUser = {
    uid: "123456",
    username: "TestUser",
    lastOnline: true
}

it('Chat Renders Correctly', () => {
    const tree = renderer
        .create((<Chat chatObj={exampleChatObj} user={exampleUser} />))
        .toJSON();
    expect(tree).toMatchSnapshot();
});