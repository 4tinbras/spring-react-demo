import {useState} from "react";

export function PrimaryButton({initialButtonText, onClickHandler}: { initialButtonText: string, onClickHandler: any }) {

    return (<button onClick={(event) => onClickHandler ? onClickHandler(event) : undefined}
                    className={"button-primary"}>{initialButtonText}</button>)
}

export function SecondaryButton({initialButtonText, onClickHandler}: {
    initialButtonText: string,
    onClickHandler: any
}) {

    return (<button onClick={() => onClickHandler ? onClickHandler() : undefined}
                    className={"button-secondary"}>{initialButtonText}</button>)
}

export function ImagesCarousel() {

    const NO_OF_ITEMS: number = 3;
    const [activeImage, setActiveImage] = useState<number>(0);

    const switchImageOnClick = (input, event) => {

        if (activeImage + input === NO_OF_ITEMS) {
            setActiveImage(0);
        } else if (activeImage + input === -1) {
            setActiveImage(NO_OF_ITEMS-1);
        } else {
            setActiveImage(activeImage + input);
        }

    }

    return (<div className={'carousel-container'}>
        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(-1, event)}>Prev</a>

        <div className={'carousel-image-container'}>
            { activeImage === 0 && (
            <div className={'carousel-image'}>
                <h1>First</h1>
            </div>)
                || activeImage === 1 && (
            <div className={'carousel-image'}>
                <h1>Second</h1>
            </div>)
                || activeImage === 2 && (
            <div className={'carousel-image'}>
                <h1>Third</h1>
            </div>)
            }
        </div>

        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(1, event)}>Next</a>
    </div>)
}