import { FirstPage } from "@mui/icons-material";
import { Member } from "../src/components/app/datatypes";
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
    firstName: "Test",
    lastName: "User",
    lastOnline: true
}

it('Member Renders Correctly', () => {
    const tree = renderer
        .create((<Member memberObj={exampleUser} />))
        .toJSON();
    expect(tree).toMatchSnapshot();
});