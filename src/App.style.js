import styled from 'styled-components';
var height = window.innerHeight
var maxWidth = window.innerHeight
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
    react-responsive-modal-container{
        react-responsive-modal-modal {
            max-width: ${maxWidth}px !important;
            width: ${maxWidth}px;
        }
    }
    .POACropView{
        img {
            height:${height}px;
        }
    }
`