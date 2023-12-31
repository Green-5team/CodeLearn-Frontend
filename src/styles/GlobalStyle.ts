import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    font-family: 'Noto Sans KR', sans-serif;
    box-sizing: border-box;
    color: white;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    cursor: url(/icon/cursor.png) 32 30,auto;
    &:active, &:focus{
      cursor: url(/icon/active_cursor.png) 32 30,auto;
    }
    user-select:none
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  li {
    list-style: none;
  }
  body{
    background: #26262d;
  }

  button{
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    /* cursor: pointer; */
    outline: inherit;
  }

  @keyframes vibration {
    from {
      transform: rotate(1deg);
    }
    to {
      transform: rotate(-1deg);
    }
  }

  @-webkit-keyframes vibration {
    from {
      transform: rotate(1deg);
    }
    to {
      transform: rotate(-1deg);
    }
  }

  @keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
  }

  @-webkit-keyframes fadein { /* Safari and Chrome */
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
  }

  @keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
  }

  @-webkit-keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
  }
`;

export default GlobalStyle;
