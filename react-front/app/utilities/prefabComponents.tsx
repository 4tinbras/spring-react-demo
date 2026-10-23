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