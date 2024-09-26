import ListGroup from "react-bootstrap/ListGroup"

const NFTList = ({ tokenIds, imgUri }) => {
    return (
        <ListGroup horizontal className="my-2 text-center">
            {tokenIds.map((tokenId, index) => (
                <ListGroup.Item key={index}>
                    <img 
                    src={ imgUri(tokenId.toString()) }
                    alt="Open Punk"
                    width='50px'
                    height='50px'
                    />
                </ListGroup.Item>
            ))}     
        </ListGroup>
    )
}

export default NFTList;