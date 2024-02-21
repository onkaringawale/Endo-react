import { RotatingLines } from 'react-loader-spinner'

function LoaderComponent({loading}) {

  return (
    <div>
        <RotatingLines
            visible={loading}
            height="96"
            width="96"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    </div>
  );
}

export default LoaderComponent;