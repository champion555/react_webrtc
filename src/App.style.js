import styled from 'styled-components';
var height = window.innerHeight
export const MyApp = styled.div`
    #video {
        height: ${height}px;
        // object-fit:fill;
    }
    .IDDocCamCrop-container{
        img {
            height:${height}px;
        }
    }
`