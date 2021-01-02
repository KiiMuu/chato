import Progress from '../layout/progress/Progress';

const ProgressBar = ({ uploadState, percentUploaded }) => (
    uploadState === 'Uploading' && (
        <Progress percentage={percentUploaded} />
    )
)

export default ProgressBar;
