import { useTranslation } from "next-i18next";

import Error from "../components/error";
import Container from "../components/container";
import Block from "../components/block";

import useWidgetAPI from "utils/proxy/use-widget-api";
import ResolvedIcon from "components/resolvedicon";

const statusMap = {
  "R": <ResolvedIcon icon="mdi-circle" width={32} height={32} />,  // running
  "S": <ResolvedIcon icon="mdi-circle-outline" width={32} height={32} />, // sleeping
  "D": <ResolvedIcon icon="mdi-circle-double" width={32} height={32} />, // disk sleep
  "Z": <ResolvedIcon icon="mdi-circle-opacity" width={32} height={32} />, // zombie
  "T": <ResolvedIcon icon="mdi-decagram-outline" width={32} height={32} />, // traced
  "t": <ResolvedIcon icon="mdi-hexagon-outline" width={32} height={32} />, // traced
  "X": <ResolvedIcon icon="mdi-rhombus-outline" width={32} height={32} />, // dead
};

export default function Component({ service }) {
  const { t } = useTranslation();

  const { data, error } = useWidgetAPI(service.widget, 'processlist', {
    refreshInterval: 1000,
  });

  if (error) {
    return <Container><Error error={error} /></Container>;
  }

  if (!data) {
    return <Container><Block position="bottom-3 left-3">-</Block></Container>;
  }

  data.splice(5);

  return (
    <Container>
      <Block position="top-4 right-3 left-3">
        <div className="flex items-center text-xs">
          <div className="grow" />
          <div className="w-14 text-right italic">{t("resources.cpu")}</div>
          <div className="w-14 text-right">{t("resources.mem")}</div>
        </div>
      </Block>

      <Block position="bottom-4 right-3 left-3">
        <div className="pointer-events-none text-theme-900 dark:text-theme-200">
          { data.map((item) => <div key={item.pid} className="text-[0.75rem] h-[0.8rem]">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1.5 opacity-50">
                {statusMap[item.status]}
              </div>
              <div className="opacity-75 grow">{item.name}</div>
              <div className="opacity-25 w-14 text-right">{item.cpu_percent.toFixed(1)}%</div>
              <div className="opacity-25 w-14 text-right">{t("common.bytes", {
                value: item.memory_info[0],
                maximumFractionDigits: 0,
              })}</div>
            </div>
          </div>) }
        </div>
      </Block>
    </Container>
  );
}
