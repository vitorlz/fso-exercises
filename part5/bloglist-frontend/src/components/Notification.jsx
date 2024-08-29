const Notification = ({ notification }) => {

    const color = notification.isError === false     
        ? 'green'
        : 'red'

    const style = {
        color: color,
        fontSize: '1.3em',
        backgroundColor: '#D3D3D3',
        margin: '10px',
        border: `3px solid ${color}`,
        borderRadius: '10px',
        width: 'fit-content',
        padding: '10x',
    }
    
    if (notification.isError && notification.message){
        return (
            <div style={style}>
                <div style={ {margin: '10px'} }>{notification.message}</div>
            </div>
        )
    } else if (notification.message) {
        return (
            <div style={style}>
                <div style={ {margin: '10px'} }>{notification.message}</div>
            </div>
        )
    }

}

export default Notification