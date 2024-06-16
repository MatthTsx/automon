import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import TierIndicator from "~/layout/components/TierIndicator";
import { api } from "~/utils/api";

function Home() {
  const router = useRouter().asPath.replace("/Battles/", "");
  const data = api.battle.GetFightData.useQuery({ id: router });

    if(data.status == "pending") return <>Loading</>

  console.log(data.data);
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between bg-neutral-900 text-white">
      <div>Battle foda</div>
      <div className="flex w-full items-center justify-between bg-red-500">
        <div className="flex items-center w-[45%] justify-end">
          {data
            .data!.BattleD.Pets.sort(
              (a, b) => a.BattlePosition - b.BattlePosition,
            )
            .map((m, i) => (
                <div className="w-[15%] relative" key={i}>
                    <Pet AType={m.BaseData.LevelAbilityType[m.Level-1]!} Damage={m.Damage} Health={m.Heath} name={m.BaseData.Name}
                    ImagePath={m.BaseData.ImagePath} Tier={m.BaseData.ShopTier} desc={m.BaseData.LevelsDescription[m.Level-1]!} id={m.id}
                    />
                </div>
            ))}
        </div>
        
        <div className="flex items-center w-[45%]">
          {data
            .data!.BattleD2!.Pets.sort(
              (a, b) => a.BattlePosition - b.BattlePosition,
            )
            .map((m, i) => (
                <div className="w-[15%] relative" key={i}>
                    <Pet AType={m.BaseData.LevelAbilityType[m.Level-1]!} Damage={m.Damage} Health={m.Heath} name={m.BaseData.Name}
                    ImagePath={m.BaseData.ImagePath} Tier={m.BaseData.ShopTier} desc={m.BaseData.LevelsDescription[m.Level-1]!} id={m.id}
                    />
                </div>
            ))}
        </div>

      </div>
      <div>A</div>
    </div>
  );
}

interface PetProps {
    ImagePath: string, desc: string, name: string
    Health: number, Damage: number, id: string
    Tier: number, AType: string
  }

function Pet({ ...p }: PetProps) {
  return (
    <div
      className="petClick group relative flex items-center justify-center"
    >
      <div className="absolute top-[-9em] z-10 hidden w-[300%] flex-col items-center rounded-md border-4 border-black bg-white p-2 pb-4 group-hover:flex 2xl:w-[250%]">
        <div className="flex  h-10 w-full items-center justify-between 2xl:h-12">
          <Image
            src={`/automons/${p.ImagePath}`}
            alt="automon"
            width={200}
            height={200}
            className="aspect-square h-full object-contain object-left"
          />
          {/* <Image src={`/automons/${p.ImagePath}`} alt='automon' width={200} height={200} className='object-contain h-full aspect-square object-right'/> */}
          <div className="flex aspect-square w-9 items-center justify-center font-Rowdies">
            
          </div>
        </div>
        <h3 className="absolute 2xl:mt-2">{p.name}</h3>

        <div className="flex items-center justify-center">
          <div className="absolute -z-[1] h-[.1em] w-full bg-gradient-to-r from-transparent via-black to-transparent" />
          <div className="aspect-square w-6">
            <TierIndicator {...p} size={0.25} b_size={0.15} />
          </div>
        </div>

        <p className="indent-2 font-Rowdies text-sm text-black/70 2xl:indent-6">
          <span className="font-bold text-black">
            {p.AType ? p.AType.replace("_", " ") + " -> " : ""}
          </span>
          {p.desc}
        </p>
      </div>

      <div>
        <Image
          src={`/automons/${p.ImagePath}`}
          alt="automon"
          width={400}
          height={400}
          className="aspect-square w-full object-contain object-left"
        />
      </div>

      <div className="absolute bottom-0 flex w-[85%] translate-y-[100%] items-center justify-between 2xl:w-[75%]">
        <div className="flex items-center justify-center rounded-full bg-white p-[3%]">
          <div className="relative flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-full border-4 border-Main_purple bg-neutral-500 font-Rubik_WP text-2xl 2xl:w-12">
            <p className="text-white drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)]">
              {p.Damage}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-full bg-white p-[3%]">
          <div className="relative flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-full border-4 border-Main_purple bg-[#f02a2a] font-Rubik_WP text-2xl 2xl:w-12">
            <p className="text-white drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)]">
              {p.Health}
            </p>
          </div>
        </div>

        <div className="absolute -z-[1] flex h-[60%] w-full justify-center">
          <div className="h-full w-[60%] rounded-xl bg-white" />
        </div>
      </div>
    </div>
  );
}

export default Home;
