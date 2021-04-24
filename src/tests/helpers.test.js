import { determineFileType , fileTypes} from "../utils/helpers";

//Not exactly needed, the function is extremely small and simple, but ehh, why not.
//Nvm, I'm keeping this, apparently this lets me know if a file extension was associated with 2 or more fileTypes.
test("Determines correct file types.",()=>{
    for(const type of Object.keys(fileTypes)){
        for(const ext of fileTypes[type]){
            expect(determineFileType(ext)).toEqual(type);
        }
    }
});

//Most methods in this module are static anyways. no need to test methods that I wont be editing, at least for now.