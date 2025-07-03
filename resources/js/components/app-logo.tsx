export default function AppLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <picture>
            <source srcSet="/assets/logo-unibalsas.webp" type="image/webp" />
            <source srcSet="/assets/logo-unibalsas.png" type="image/png" />
            <img
                src="/assets/logo-unibalsas.webp"
                alt="App Logo"
                {...props}
            />
        </picture>
    );
}