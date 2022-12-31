import { Component, html } from "@state-ui/core";
import { RouteCompArgs } from "@state-ui/extra/lib/router/types";
import Code from "../components/base/code";

const codeTest = `
import { html, Component } from '@state-ui/core'

const Foo: Component = ({}) => {
  return html\`
    <div class="foo"></div>
  \`
}

export default Foo
`.trim()

const GettingStarted: Component<RouteCompArgs> = ({ params }) => {
  return html`
    <div>
      <h2>Getting Started</h2>
      ${Code({ code: codeTest })}
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec justo mauris, sollicitudin ac vulputate quis, commodo id mi. Nulla tristique imperdiet sodales. Duis pharetra felis eros, eu tempus est congue at. In dapibus elit in dolor accumsan, eget tincidunt elit dictum. Ut euismod tellus sit amet volutpat sagittis. Sed finibus neque sit amet ultricies eleifend. Fusce fringilla, diam non blandit ullamcorper, nisi sem lobortis tortor, et molestie magna neque efficitur magna. Donec ultrices mauris suscipit sem varius faucibus. Ut ac justo quam. Integer pharetra, turpis id sollicitudin consectetur, lectus arcu scelerisque elit, non venenatis ipsum odio quis mi.

        Ut cursus nec urna non viverra. Donec non quam fermentum, pretium nulla quis, luctus est. Cras interdum viverra feugiat. In accumsan quam id malesuada hendrerit. Etiam quis maximus nunc, vitae convallis nulla. Donec erat quam, consectetur sit amet quam sagittis, facilisis imperdiet augue. Sed sem diam, facilisis sed eros sit amet, condimentum porta sem. Vivamus cursus tempor tortor, nec finibus massa rhoncus nec. Mauris et nisl urna. Aliquam gravida nibh eget aliquam convallis. Aliquam consequat nibh sit amet est faucibus consequat.

        Cras pellentesque dignissim eleifend. Praesent lobortis ultricies mi in imperdiet. Nullam hendrerit imperdiet rutrum. Vestibulum luctus, sem vel posuere finibus, eros nibh feugiat orci, eget vehicula mauris dui vitae nulla. Fusce porttitor, orci et vestibulum dignissim, sem justo efficitur sapien, a lobortis quam nisl id ligula. Sed quis dapibus orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus risus purus, auctor nec risus faucibus, congue tincidunt turpis. Donec rutrum eu nibh vel varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque consectetur eget enim non pharetra. Curabitur scelerisque justo urna, vel hendrerit arcu efficitur in.

        Nam sit amet lectus tortor. Donec consequat leo eu ligula fermentum fermentum. Donec vulputate enim felis, at hendrerit ex tempus in. Mauris efficitur commodo ipsum sit amet sagittis. Maecenas vehicula velit augue, posuere accumsan ipsum porttitor aliquam. Mauris felis enim, vestibulum eu dapibus id, ultrices euismod dolor. Sed condimentum ex a elit condimentum congue. Etiam eget volutpat lacus, vitae pharetra nulla. Curabitur venenatis gravida tortor vel aliquet. Nam sed tincidunt erat, finibus mattis lacus. Vestibulum est magna, elementum eget diam eget, pharetra condimentum est. Cras id venenatis arcu, vitae lobortis lacus. Mauris mollis, erat a elementum vehicula, mauris elit vestibulum justo, a porttitor lacus ex ut magna. Mauris varius neque ac velit mattis, sed egestas libero sodales.

        Donec sodales suscipit est ut condimentum. In fringilla imperdiet lacinia. Phasellus tempus pharetra dolor, in malesuada ligula gravida vulputate. Integer mattis nisl mi, a dignissim lorem cursus eget. Sed hendrerit odio in neque feugiat, id varius risus blandit. Pellentesque eget blandit est, consequat blandit tortor. Ut fringilla erat ut enim venenatis sollicitudin. Vestibulum orci lectus, tincidunt vitae ipsum at, aliquet venenatis nunc. Phasellus at enim auctor, ultricies eros ac, efficitur ligula. Nullam mauris urna, posuere quis ornare a, pretium sed arcu. Donec imperdiet at diam quis placerat. Nulla facilisi. Proin a convallis justo. Donec tristique in purus nec placerat. Vestibulum posuere eleifend viverra.

        Donec enim leo, fermentum ut pretium iaculis, tempor et augue. Nunc sit amet nisl commodo, scelerisque libero sit amet, efficitur lorem. Aenean nisl lectus, lacinia in volutpat viverra, placerat non nulla. Integer justo eros, vehicula at eros ut, convallis euismod augue. Duis gravida volutpat lacinia. Pellentesque ac viverra ante, vitae rutrum turpis. Pellentesque sed sollicitudin leo, sed ultricies justo. Vivamus tincidunt sem sed auctor eleifend. Etiam ornare nec massa a elementum. Nullam sit amet ante nibh. Nam ac mi lacus.

        Nunc nec libero ut velit finibus placerat. Nullam ac diam quis massa efficitur porttitor. Quisque ut congue lacus. Suspendisse sed mi sit amet sapien scelerisque commodo. Nunc consectetur risus risus, in egestas odio molestie id. Mauris consectetur nunc ac congue gravida. Donec a sapien tristique, ullamcorper odio eget, fringilla mi. Nunc at volutpat arcu. Vivamus tellus eros, elementum eu efficitur non, fringilla sit amet risus. Curabitur pretium varius congue. Quisque nec quam malesuada, pretium est quis, interdum augue. Duis eleifend metus at quam eleifend maximus. Aliquam ligula elit, tempus ac finibus nec, imperdiet a augue. Sed nec blandit lorem. Nullam lacinia ipsum sit amet ex molestie ultrices. Ut eu mollis ipsum.

        Duis ultricies laoreet ipsum, sit amet ornare turpis fermentum ac. Vestibulum et dolor rhoncus, iaculis nibh et, pulvinar mauris. Nunc efficitur ipsum ac sapien ullamcorper sodales. Quisque sit amet lacus ipsum. Nulla eget rutrum orci. Vestibulum aliquet efficitur arcu, ut maximus tellus elementum ac. Duis blandit vitae ex in elementum. Integer diam lacus, facilisis non ex sed, faucibus sodales magna.

        Morbi condimentum lectus vitae nulla elementum, vitae venenatis est laoreet. Pellentesque rhoncus ante nec ex fringilla porta. Fusce libero metus, vestibulum eget tortor a, efficitur malesuada tellus. Curabitur vel ante ac justo varius scelerisque id a velit. Nulla dolor diam, placerat nec nisi non, vehicula vestibulum lacus. Duis maximus mi vel purus sollicitudin rhoncus. Sed vel luctus ligula. Curabitur commodo diam vitae odio pellentesque, in blandit elit efficitur. Aliquam dapibus convallis tincidunt. Donec ut pretium massa.

        Quisque sollicitudin massa lacus, sed scelerisque nulla condimentum at. Nam vitae tortor eget nisl ornare lacinia ac et odio. Praesent eu aliquet ex. Pellentesque venenatis risus nisl, ut vulputate erat varius sed. Etiam id placerat turpis. Aenean lectus nunc, hendrerit vitae ante quis, tincidunt rhoncus lectus. Vestibulum placerat enim purus. Curabitur in iaculis nibh. In dui felis, dapibus id vestibulum eget, porttitor ac mi. Etiam condimentum pretium elit quis accumsan. Quisque blandit sodales libero, ac pulvinar quam luctus id. Maecenas imperdiet rhoncus arcu vel lacinia. Nunc non arcu diam. 
      </p>

      <h2 id="sec">Second header</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec justo mauris, sollicitudin ac vulputate quis, commodo id mi. Nulla tristique imperdiet sodales. Duis pharetra felis eros, eu tempus est congue at. In dapibus elit in dolor accumsan, eget tincidunt elit dictum. Ut euismod tellus sit amet volutpat sagittis. Sed finibus neque sit amet ultricies eleifend. Fusce fringilla, diam non blandit ullamcorper, nisi sem lobortis tortor, et molestie magna neque efficitur magna. Donec ultrices mauris suscipit sem varius faucibus. Ut ac justo quam. Integer pharetra, turpis id sollicitudin consectetur, lectus arcu scelerisque elit, non venenatis ipsum odio quis mi.

        Ut cursus nec urna non viverra. Donec non quam fermentum, pretium nulla quis, luctus est. Cras interdum viverra feugiat. In accumsan quam id malesuada hendrerit. Etiam quis maximus nunc, vitae convallis nulla. Donec erat quam, consectetur sit amet quam sagittis, facilisis imperdiet augue. Sed sem diam, facilisis sed eros sit amet, condimentum porta sem. Vivamus cursus tempor tortor, nec finibus massa rhoncus nec. Mauris et nisl urna. Aliquam gravida nibh eget aliquam convallis. Aliquam consequat nibh sit amet est faucibus consequat.

        Cras pellentesque dignissim eleifend. Praesent lobortis ultricies mi in imperdiet. Nullam hendrerit imperdiet rutrum. Vestibulum luctus, sem vel posuere finibus, eros nibh feugiat orci, eget vehicula mauris dui vitae nulla. Fusce porttitor, orci et vestibulum dignissim, sem justo efficitur sapien, a lobortis quam nisl id ligula. Sed quis dapibus orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus risus purus, auctor nec risus faucibus, congue tincidunt turpis. Donec rutrum eu nibh vel varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque consectetur eget enim non pharetra. Curabitur scelerisque justo urna, vel hendrerit arcu efficitur in.

        Nam sit amet lectus tortor. Donec consequat leo eu ligula fermentum fermentum. Donec vulputate enim felis, at hendrerit ex tempus in. Mauris efficitur commodo ipsum sit amet sagittis. Maecenas vehicula velit augue, posuere accumsan ipsum porttitor aliquam. Mauris felis enim, vestibulum eu dapibus id, ultrices euismod dolor. Sed condimentum ex a elit condimentum congue. Etiam eget volutpat lacus, vitae pharetra nulla. Curabitur venenatis gravida tortor vel aliquet. Nam sed tincidunt erat, finibus mattis lacus. Vestibulum est magna, elementum eget diam eget, pharetra condimentum est. Cras id venenatis arcu, vitae lobortis lacus. Mauris mollis, erat a elementum vehicula, mauris elit vestibulum justo, a porttitor lacus ex ut magna. Mauris varius neque ac velit mattis, sed egestas libero sodales.

        Donec sodales suscipit est ut condimentum. In fringilla imperdiet lacinia. Phasellus tempus pharetra dolor, in malesuada ligula gravida vulputate. Integer mattis nisl mi, a dignissim lorem cursus eget. Sed hendrerit odio in neque feugiat, id varius risus blandit. Pellentesque eget blandit est, consequat blandit tortor. Ut fringilla erat ut enim venenatis sollicitudin. Vestibulum orci lectus, tincidunt vitae ipsum at, aliquet venenatis nunc. Phasellus at enim auctor, ultricies eros ac, efficitur ligula. Nullam mauris urna, posuere quis ornare a, pretium sed arcu. Donec imperdiet at diam quis placerat. Nulla facilisi. Proin a convallis justo. Donec tristique in purus nec placerat. Vestibulum posuere eleifend viverra.

        Donec enim leo, fermentum ut pretium iaculis, tempor et augue. Nunc sit amet nisl commodo, scelerisque libero sit amet, efficitur lorem. Aenean nisl lectus, lacinia in volutpat viverra, placerat non nulla. Integer justo eros, vehicula at eros ut, convallis euismod augue. Duis gravida volutpat lacinia. Pellentesque ac viverra ante, vitae rutrum turpis. Pellentesque sed sollicitudin leo, sed ultricies justo. Vivamus tincidunt sem sed auctor eleifend. Etiam ornare nec massa a elementum. Nullam sit amet ante nibh. Nam ac mi lacus.

        Nunc nec libero ut velit finibus placerat. Nullam ac diam quis massa efficitur porttitor. Quisque ut congue lacus. Suspendisse sed mi sit amet sapien scelerisque commodo. Nunc consectetur risus risus, in egestas odio molestie id. Mauris consectetur nunc ac congue gravida. Donec a sapien tristique, ullamcorper odio eget, fringilla mi. Nunc at volutpat arcu. Vivamus tellus eros, elementum eu efficitur non, fringilla sit amet risus. Curabitur pretium varius congue. Quisque nec quam malesuada, pretium est quis, interdum augue. Duis eleifend metus at quam eleifend maximus. Aliquam ligula elit, tempus ac finibus nec, imperdiet a augue. Sed nec blandit lorem. Nullam lacinia ipsum sit amet ex molestie ultrices. Ut eu mollis ipsum.

        Duis ultricies laoreet ipsum, sit amet ornare turpis fermentum ac. Vestibulum et dolor rhoncus, iaculis nibh et, pulvinar mauris. Nunc efficitur ipsum ac sapien ullamcorper sodales. Quisque sit amet lacus ipsum. Nulla eget rutrum orci. Vestibulum aliquet efficitur arcu, ut maximus tellus elementum ac. Duis blandit vitae ex in elementum. Integer diam lacus, facilisis non ex sed, faucibus sodales magna.

        Morbi condimentum lectus vitae nulla elementum, vitae venenatis est laoreet. Pellentesque rhoncus ante nec ex fringilla porta. Fusce libero metus, vestibulum eget tortor a, efficitur malesuada tellus. Curabitur vel ante ac justo varius scelerisque id a velit. Nulla dolor diam, placerat nec nisi non, vehicula vestibulum lacus. Duis maximus mi vel purus sollicitudin rhoncus. Sed vel luctus ligula. Curabitur commodo diam vitae odio pellentesque, in blandit elit efficitur. Aliquam dapibus convallis tincidunt. Donec ut pretium massa.

        Quisque sollicitudin massa lacus, sed scelerisque nulla condimentum at. Nam vitae tortor eget nisl ornare lacinia ac et odio. Praesent eu aliquet ex. Pellentesque venenatis risus nisl, ut vulputate erat varius sed. Etiam id placerat turpis. Aenean lectus nunc, hendrerit vitae ante quis, tincidunt rhoncus lectus. Vestibulum placerat enim purus. Curabitur in iaculis nibh. In dui felis, dapibus id vestibulum eget, porttitor ac mi. Etiam condimentum pretium elit quis accumsan. Quisque blandit sodales libero, ac pulvinar quam luctus id. Maecenas imperdiet rhoncus arcu vel lacinia. Nunc non arcu diam. 
      </p>
    </div>
  `.on('mount', () => {
    // scroll to element with id `params.section`
    const section = document.getElementById(params.section)
    setTimeout(() => section?.scrollIntoView(), 10)
  })
}

export default GettingStarted
