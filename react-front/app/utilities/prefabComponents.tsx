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

    const NO_OF_ITEMS: number = 5;
    const MARGIN_ITEMS: number = 1;
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

    function isImageWithinMargin(imageIndex: number, currentIndex: number, margin: number) {

        return (imageIndex >= currentIndex && imageIndex <= currentIndex + margin)
            || (imageIndex < currentIndex && imageIndex >= currentIndex - margin);
    }

    return (<div className={'carousel-container'}>
        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(-1, event)}>Prev</a>

        <div className={'carousel-image-container'}>
            <div {...(!isImageWithinMargin(0, activeImage, MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 0 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image"})}>
                <h1>First</h1>
            </div>
            <div {...(!isImageWithinMargin(1, activeImage, MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 1 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image"})}>
                <h1>Second</h1>
            </div>
            <div {...(!isImageWithinMargin(2, activeImage, MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 2 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image"})}>
                <h1>Third</h1>
            </div>
            <div {...(!isImageWithinMargin(3, activeImage, MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 3 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image"})}>
                <h1>Fourth</h1>
            </div>
            <div {...(!isImageWithinMargin(4, activeImage, MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 4 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image"})}>
                <h1>Fifth</h1>
            </div>

        </div>

        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(1, event)}>Next</a>
    </div>)
}