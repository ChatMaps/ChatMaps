import { RMF } from "../src/components/app/datatypes";
import renderer from 'react-test-renderer';

var message = "Hello, World! This is a test message. https://www.google.com"

it('RMF Renders Correctly', () => {
    const tree = renderer
        .create((RMF(message)))
        .toJSON();
    expect(tree).toMatchSnapshot();
});