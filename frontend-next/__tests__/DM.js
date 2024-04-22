import { DM } from "../src/components/app/friends/dm";
import renderer from 'react-test-renderer';

var message = "Hello, World! This is a test message. https://www.google.com"

var exampleUser = {
    uid: "123456",
    username: "TestUser",
    firstName: "Test",
    lastName: "User",
    lastOnline: true,
    pfp: "https://th.bing.com/th/id/OIP.K5VoTfw97JiEc1OBODAjmQHaHO?rs=1&pid=ImgDetMain"
}

var friendObj = {
    uid: "123456",
    username: "TestUser",
    firstName: "Test",
    lastName: "Friend",
    lastOnline: true,
    pfp: "https://th.bing.com/th/id/OIP.K5VoTfw97JiEc1OBODAjmQHaHO?rs=1&pid=ImgDetMain"

}

it('RMF Renders Correctly', () => {
    const tree = renderer
        .create(<DM user={exampleUser} friendObj={friendObj} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});