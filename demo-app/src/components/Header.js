import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function HeaderComponent(walletHdlr) {
    return (
        <>
            <Navbar bg="light">
                {/* <Nav>
                    <Navbar.Brand href="#">
                        W3-iMDB
                    </Navbar.Brand>
                </Nav> */}

                <Nav className="mx-right">
                    <Button variant="dark" onClick={walletHdlr}>Connect Wallet</Button>
                </Nav>
            </Navbar>
        </>
    );
}

export default HeaderComponent;