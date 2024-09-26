import { useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import { Spinner } from "react-bootstrap"

const Mint = ({ provider, nft, cost, isWhitelisted, setIsLoading }) => {

    const [isWaiting, setIsWaiting] = useState(false)
    const [amount, setAmount] = useState(0)

    const mintHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)
        
        try {
            const signer = await provider.getSigner()
            const transaction = await nft.connect(signer).mint(amount, { value: cost.mul(amount) })
            await transaction.wait()
        } catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    return (
        <Form onSubmit={mintHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
            {isWaiting ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto'}}/>
            ) : (
                <InputGroup className="mb-3">
                    <Form.Control
                        disabled={!isWhitelisted} 
                        type="number"
                        placeholder="Mint amount"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button 
                        variant='primary'
                        type='submit'
                        disabled={!isWhitelisted}
                    >
                        Mint
                    </Button>
                </InputGroup>
            )}
        </Form>
    )
}

export default Mint;