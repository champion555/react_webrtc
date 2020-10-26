import React from 'react';

class ResultPage extends React.Component {
    render() {
        const { data } = this.props;

        return (
            <div className="result-container">

                <button onClick={this.props.onClose} style={{ marginTop: '50px', marginLeft: '50px' }}>Back</button>

                <pre style={{ color: 'white', background: 'black', padding: '50px', paddingTop: '20px' }}>
                    {JSON.stringify(data, null, 2)}
                </pre>

            </div>
        );
    }
}

export default ResultPage;
