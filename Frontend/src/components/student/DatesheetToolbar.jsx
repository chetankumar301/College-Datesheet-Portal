export default function DatesheetToolbar({

    search,

    setSearch,

    status,

    setStatus,

    onDownload,

    onPrint

}) {

    return (

        <div className="datesheet-toolbar">

            <input

                type="text"

                placeholder="Search Subject..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

            />

            <select

                value={status}

                onChange={(e) => setStatus(e.target.value)}

            >

                <option value="">All</option>

                <option value="Upcoming">Upcoming</option>

                <option value="Completed">Completed</option>

            </select>

            <button onClick={onDownload}>

                Download PDF

            </button>

            <button onClick={onPrint}>

                Print

            </button>

        </div>

    );

}