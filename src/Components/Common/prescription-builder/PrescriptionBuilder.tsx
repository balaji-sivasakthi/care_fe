import AutoCompleteAsync from "../../Form/AutoCompleteAsync";
import SelectMenuV2 from "../../Form/SelectMenuV2";
import { PrescriptionDropdown } from "./PrescriptionDropdown";
import { PrescriptionBuilderProps } from "./PRNPrescriptionBuilder";
import CareIcon from "../../../CAREUI/icons/CareIcon";
import medicines_list from "./assets/medicines.json";
import ToolTip from "../utils/Tooltip";
import { useState } from "react";

export const medicines = medicines_list;

const frequency = ["Stat", "od", "hs", "bd", "tid", "qid", "q4h", "qod", "qwk"];
const frequencyTips = {
  Stat: "Immediately",
  od: "once daily",
  hs: "Night only",
  bd: "Twice daily",
  tid: "8th hourly",
  qid: "6th hourly",
  q4h: "4th hourly",
  qod: "Alternate day",
  qwk: "Once a week",
};
export const routes = ["Oral", "IV", "IM", "S/C"];
export const units = ["mg", "g", "ml", "drops", "ampule", "tsp"];

export type PrescriptionType = {
  medicine?: string;
  route?: string;
  dosage?: string; // is now frequency
  dosage_new?: string;
  days?: number;
  notes?: string;
};

export const emptyValues = {
  medicine: "",
  route: "",
  dosage: "",
  dosage_new: "0 mg",
  days: 0,
  notes: "",
};

export default function PrescriptionBuilder(
  props: PrescriptionBuilderProps<PrescriptionType>
) {
  const { prescriptions, setPrescriptions } = props;

  const setItem = (object: PrescriptionType, i: number) => {
    setPrescriptions(
      prescriptions.map((prescription, index) =>
        index === i ? object : prescription
      )
    );
  };

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="mt-2">
      {prescriptions.map((prescription, i) => {
        const setMedicine = (medicine: string) => {
          setItem(
            {
              ...prescription,
              medicine,
            },
            i
          );
        };

        const setRoute = (route: string) => {
          setItem(
            {
              ...prescription,
              route,
            },
            i
          );
        };

        const setFrequency = (frequency: string) => {
          setItem(
            {
              ...prescription,
              dosage: frequency,
            },
            i
          );
        };

        const setDosageUnit = (unit: string) => {
          setItem(
            {
              ...prescription,
              dosage_new: prescription.dosage_new
                ? prescription.dosage_new.split(" ")[0] + " " + unit
                : "0 mg",
            },
            i
          );
        };

        return (
          <div
            key={i}
            className={`border-2 ${
              activeIdx === i ? "border-primary-500" : "border-gray-500"
            } mb-2 border-dashed border-spacing-2 p-3 rounded-md text-sm text-gray-600`}
          >
            <div className="flex flex-wrap md:flex-row md:gap-4 gap-2 items-center mb-2">
              <h4 className="text-base font-medium text-gray-700">
                Prescription No. {i + 1}
              </h4>
              <button
                type="button"
                className="h-full flex justify-center items-center gap-2 text-gray-100 rounded-md text-sm transition hover:bg-red-600 px-3 py-1 bg-red-500"
                onClick={() => {
                  setPrescriptions(
                    prescriptions.filter((prescription, index) => i != index)
                  );
                }}
              >
                Delete Prescription
                <CareIcon className="care-l-trash-alt w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 flex-col md:flex-row md:mb-4">
              <div className="w-full">
                <div className="mb-1">
                  Medicine <span className="font-bold text-red-600">*</span>
                </div>
                <AutoCompleteAsync
                  onFocus={() => setActiveIdx(i)}
                  onBlur={() => setActiveIdx(null)}
                  placeholder="Medicine"
                  selected={prescription.medicine}
                  fetchData={(search) => {
                    return Promise.resolve(
                      medicines.filter((medicine: string) =>
                        medicine.toLowerCase().includes(search.toLowerCase())
                      )
                    );
                  }}
                  optionLabel={(option) => option}
                  onChange={setMedicine}
                  showNOptions={medicines.length}
                />
              </div>
              <div className="flex gap-2">
                <div>
                  <div className="mb-1">Route</div>
                  <SelectMenuV2
                    placeholder="Route"
                    options={routes}
                    value={prescription.route}
                    onChange={(route) => setRoute(route || "")}
                    optionLabel={(option) => option}
                    required={false}
                    className="mt-[6px]"
                    onFocus={() => setActiveIdx(i)}
                    onBlur={() => setActiveIdx(null)}
                  />
                </div>
                <div>
                  <div className="mb-1">
                    Frequency <span className="font-bold text-red-600">*</span>
                  </div>
                  <SelectMenuV2
                    placeholder="Frequency"
                    options={frequency}
                    value={prescription.dosage}
                    onChange={(freq) => setFrequency(freq || "")}
                    optionLabel={(option) => option}
                    optionIcon={(option) => (
                      <ToolTip
                        className="-right-2 bottom-[calc(100%+1px)] max-w-[100px]"
                        position="CUSTOM"
                        text={
                          <span>
                            {
                              frequencyTips[
                                option as keyof typeof frequencyTips
                              ]
                            }
                          </span>
                        }
                      >
                        <i className="fa-solid fa-circle-info"></i>
                      </ToolTip>
                    )}
                    showIconWhenSelected={false}
                    required={false}
                    className="mt-[6px] w-[150px]"
                    onFocus={() => setActiveIdx(i)}
                    onBlur={() => setActiveIdx(null)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 flex-col md:flex-row">
              <div className="w-full md:w-[260px] flex gap-2 shrink-0">
                <div>
                  <div className="mb-1">Dosage</div>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      className="cui-input-base py-0"
                      value={prescription.dosage_new?.split(" ")[0]}
                      placeholder="Dosage"
                      min={0}
                      onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        if (value < 0) {
                          value = 0;
                        }
                        setItem(
                          {
                            ...prescription,
                            dosage_new:
                              value +
                              " " +
                              (prescription.dosage_new?.split(" ")[1] || "mg"),
                          },
                          i
                        );
                      }}
                      required
                      onFocus={() => setActiveIdx(i)}
                      onBlur={() => setActiveIdx(null)}
                    />
                    <div className="w-[80px] shrink-0">
                      <PrescriptionDropdown
                        placeholder="Unit"
                        options={units}
                        value={prescription.dosage_new?.split(" ")[1] || "mg"}
                        setValue={setDosageUnit}
                        onFocus={() => setActiveIdx(i)}
                        onBlur={() => setActiveIdx(null)}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-[70px] shrink-0">
                  <div className="mb-1">Days</div>
                  <input
                    type="number"
                    className="cui-input-base py-2"
                    value={prescription.days}
                    placeholder="Days"
                    min={0}
                    onChange={(e) => {
                      let value = parseInt(e.target.value);
                      if (value < 0) {
                        value = 0;
                      }
                      setItem(
                        {
                          ...prescription,
                          days: value,
                        },
                        i
                      );
                    }}
                    required
                    onFocus={() => setActiveIdx(i)}
                    onBlur={() => setActiveIdx(null)}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="mb-1">Notes</div>
                <input
                  type="text"
                  className="cui-input-base py-2"
                  value={prescription.notes}
                  placeholder="Notes"
                  onChange={(e) => {
                    setItem(
                      {
                        ...prescription,
                        notes: e.target.value,
                      },
                      i
                    );
                  }}
                  onFocus={() => setActiveIdx(i)}
                  onBlur={() => setActiveIdx(null)}
                />
              </div>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          setPrescriptions([...prescriptions, emptyValues]);
        }}
        className="shadow-sm mt-4 bg-gray-200 w-full font-bold block px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
      >
        + Add Medicine
      </button>
    </div>
  );
}
