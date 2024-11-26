interface ResponseMsgProps {
    response: string;
    insufficient: boolean;
    insufficientMsg: string;
}

export default function ResponseMsg(props: ResponseMsgProps) {
    return (
        <div className="whitespace-pre-line">
            {props.insufficient && <span>
                <i>{props.insufficientMsg}</i>{props.response.substring(props.insufficientMsg.length)}
            </span>}
            {!props.insufficient && props.response}
        </div>
    );
}
