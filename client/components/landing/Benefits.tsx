export function Benefits(): JSX.Element {
  return (
    <div className="my-auto flex h-full flex-col items-center px-2 py-16 lg:py-20">
      <div className="mb-10 max-w-xl sm:text-center md:mx-auto md:mb-12">
        <div>
          <p className="text-muted-foreground/60 text-lg font-bold">Benefits</p>
        </div>
        <h2 className="text-primary mb-6 max-w-lg font-sans text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="text-blue-gray-100 absolute left-0 top-0 z-0 -ml-20 -mt-8 hidden w-32 sm:block lg:-ml-28 lg:-mt-10 lg:w-32"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative"></span>
          </span>
          {""}
          Navigate through Databases easily
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Create hierarchical namespaces under the root QUADB.fil, facilitating
          organization and categorization of datasets and codebases.
        </p>
      </div>
      <div className="mx-auto mb-[18%] grid h-full space-y-6 lg:grid-cols-2 lg:gap-x-5 lg:space-y-0">
        <div className="space-y-6 sm:px-2">
          {/* Enhanced Transparency */}
          <div className="show flex flex-col sm:flex-row">
            <div className="mb-4 mr-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-bar-both"
                  width="38   "
                  height="38   "
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 12h-6" />
                  <path d="M5 15l-3 -3l3 -3" />
                  <path d="M22 12h-6" />
                  <path d="M19 15l3 -3l-3 -3" />
                  <path d="M12 4v16" />
                </svg>
              </div>
            </div>
            <div>
              <h6 className="text-primary mb-3 text-xl font-bold leading-5">
                Access Control
              </h6>
              <p className="text-sm text-gray-900">
                Fine-grained control over data access and curation. Datasets can
                be designated as PUBLIC, GROUPED-PUBLIC, PAID-GROUPED, or
                PAID-PRIVATE
              </p>
            </div>
          </div>

          {/* Automated Processes */}
          <div className="show flex flex-col sm:flex-row">
            <div className="mb-4 mr-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-loader-3"
                  width="38 "
                  height="38 "
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" />
                  <path d="M17 12a5 5 0 1 0 -5 5" />
                </svg>
              </div>
            </div>
            <div>
              <h6 className="text-primary mb-3 text-xl font-bold leading-5">
                Feel the power of Decentralization
              </h6>
              <p className="text-sm text-gray-900">
                QUADB is scoping to be the first decentralized database
                namespace that will be used by the AI industry. The D-Kaggle
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:px-2">
          {/* Increased Security */}
          <div className="show flex flex-col sm:flex-row">
            <div className="mb-4 mr-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-shield-lock"
                  width="38  "
                  height="38  "
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                  <path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 12l0 2.5" />
                </svg>
              </div>
            </div>
            <div>
              <h6 className="text-primary mb-3 text-xl font-bold leading-5">
                Increased Security and Colaboration
              </h6>
              <p className="text-sm text-gray-900">
                Utilizes Lighthouse's encryption SDK to secure IPNS records,
                ensuring that only authorized curators can decrypt and modify
                dataset contents and associated code.
              </p>
            </div>
          </div>

          {/* Democratized Investment Access */}
          <div className="show flex flex-col sm:flex-row">
            <div className="mb-4 mr-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-users"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>
              </div>
            </div>
            <div>
              <h6 className="text-primary mb-3 text-xl font-bold leading-5">
                Democratized Dataset Access
              </h6>
              <p className="text-sm text-gray-900">
                All data and code are stored on the IPFS and Filecoin networks,
                providing decentralized storage and immutable data integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
