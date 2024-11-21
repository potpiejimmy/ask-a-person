const GPT_MODEL_NAME = "GPT-4o mini";

interface PoweredByProps {
    name: string;
}

export default function PoweredBy(props: PoweredByProps) {

    return (
        <div>
            <div className="font-bold">
                {props.name}:
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>powered by {GPT_MODEL_NAME}</div>
        </div>
    );
}