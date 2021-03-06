import styled from '@emotion/styled'

export const Logo = styled.div`
    margin-inline: 1rem;
    font-weight: bold;
    a:hover {
        color: #c6c6c6;
    }
`
export const Wrapper = styled.div`
    display: flex;
    flex: 1;
`
export const Contents = styled.div<{ expand: boolean }>`
    flex: 1;
    margin-top: 3rem;
    padding-left: 3rem;
    ${({ expand }) =>
        expand &&
        `
        padding-left: 16rem;
    `};

    @media (max-width: 671px) {
        ${({ expand }) =>
            expand &&
            `
            padding-left: 3rem;
        `};
    }
`
