import Document, {Head, Main, NextScript} from 'next/document';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
    static getInitialProps({renderPage}) {
        const {html, head} = renderPage();
        const styles = flush();
        return {html, head, styles};
    }

    render() {
        return (
            <html>
                <Head>
                    <title>My page title</title>
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                    <link
                        rel="stylesheet"
                        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"/>
                    <link
                        rel="stylesheet"
                        href="/static/css/main.css"/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </html>
        )
    }
};
